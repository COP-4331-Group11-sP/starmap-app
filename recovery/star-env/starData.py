from astroquery.simbad import Simbad
from astroquery.vizier import Vizier
import astropy.coordinates as coord
import astropy.units as u
import pandas as pd
import numpy as np
import math
import json

def clamp(n, smallest, largest): 
	return max(smallest, min(n, largest))

def temp(bv):
	temp = clamp(4600 * (1 / (0.92 * bv + 1.7) + 1 / (0.92 * bv + 0.62)), 1000, 40000)
	return round(temp / 100.0) * 100

def temp_exact(bv):
	return clamp(4600 * (1 / (0.92 * bv + 1.7) + 1 / (0.92 * bv + 0.62)), 1000, 40000)

def radius(bv, lum):
	solar_mag = 3.85 * 10**26
	delta = 5.671 * 10**-8
	L = lum * solar_mag
	T = bv.apply(lambda bv: temp_exact(bv))
	return np.sqrt(L / (4 * math.pi * delta * T**4))



tempToColor = pd.read_csv('tempToColor.csv', index_col='K')

'''
For usage with the HIP Database
catalog = 'I/239/hip_main'
columns = ['_RA.icrs','_DE.icrs','B-V', 'Plx', 'HIP', 'Vmag']

managedSimbad = Simbad()
v = Vizier(columns=columns)
v.ROW_LIMIT = -1
v.TIMEOUT = 300
print('Making data request...')
catalog_list = v.get_catalogs([catalog])
print('Request finished.\n')
print('Processing data...')
df = catalog_list[catalog].to_pandas()


# cleaning data
df = df[df['B-V'].notna()]
df = df[df['ra'].notna()]
df = df[df['appMag'].notna()]
df = df[~(df['Plx'] == 0)]

df.rename(columns = {'_RA.icrs': 'ra', '_DE.icrs': 'dec', 'Vmag': 'appMag'}, inplace=True)

# found from https://astronomy.gatech.edu/Courses/Phys3021/Lectures/pdf/Distances_Motions.pdf
df['dist'] = df['Plx'].apply(lambda p: 1000/abs(p))
# df = df[df['dist'].notna()]
# df = df[~(df['dist'] <= 0)]
df['absMag'] = df['appMag'] - df['dist'].apply(lambda d: 5 * np.log10(d) - 5)

df['id'] = df['HIP'].apply(lambda n: 'HIP ' + str(n))
'''

df = pd.read_csv('./data/hygdata_v3.csv', header=0)


df.rename(columns = {'mag': 'appMag', 'absmag': 'absMag', 'ci': 'B-V'}, inplace=True)
df['ra'] = df['ra'] * 15;

df['radius'] = radius(df['B-V'], df['lum'])

print('Data processing finished.\n')

print('Processing color...')
df['color'] = df['B-V'].apply(lambda bv: tempToColor.loc[temp(bv)])
# for HIP catalogue
# df = df.drop(['B-V', 'Plx', 'HIP'], axis=1)

# for HYG catalogue
df = df[['id', 'proper', 'ra', 'dec', 'appMag', 'absMag', 'dist', 'radius', 'color']]

dfs = np.array_split(df, 11)
print('Color processing finished.\n')
print('Writing to files...')
columns = df.to_json(orient='split')
columns = json.loads(columns)
columns = columns['columns']
columns = json.dumps(columns)


#print('\tWriting to ./data/columns.json...')
#with open('./data/columns.json', 'w') as out:
#	out.write(columns)

for d in range(len(dfs)):
	fname = './data/stars_' + str(d) + '.json'
	print('\tWriting to ' + fname + '...')
	with open('./data/stars_' + str(d) + '.json', 'w') as out:
		out.write(dfs[d].to_json(orient='values'))
# testing total file size
print('\tWriting to ./data/stars_total.json')
with open('./data/stars_total.json', 'w') as out:
	out.write(df.to_json(orient='records'))


print('Completed.\n')