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

tempToColor = pd.read_csv('tempToColor.csv', index_col='K')

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
df = df[df['_RA.icrs'].notna()]
df = df[df['Vmag'].notna()]
df = df[~(df['Plx'] == 0)]

df.rename(columns = {'_RA.icrs': 'ra', '_DE.icrs': 'dec', 'Vmag': 'appMag'}, inplace=True)

# found from https://astronomy.gatech.edu/Courses/Phys3021/Lectures/pdf/Distances_Motions.pdf
df['dist'] = df['Plx'].apply(lambda p: 1000/abs(p))
# df = df[df['dist'].notna()]
# df = df[~(df['dist'] <= 0)]
df['absMag'] = df['appMag'] - df['dist'].apply(lambda d: 5 * np.log10(d) - 5)

df['id'] = df['HIP'].apply(lambda n: 'HIP ' + str(n))

print('Data processing finished.\n')
'''
managedSimbad.ROW_LIMIT = -1
managedSimbad.TIMEOUT = 600
managedSimbad.remove_votable_fields('coordinates')

print('Making id request...')
result_table = managedSimbad.query_objects(df['HIP'].to_list())
print('Request finished. Processing id...')
df['id'] = result_table.to_pandas()['MAIN_ID']
print('Id processing finished.\n')
'''

print('Processing color...')
df['color'] = df['B-V'].apply(lambda bv: tempToColor.loc[temp(bv)])
df = df.drop(['B-V', 'Plx', 'HIP', 'appMag'], axis=1)
print('Color processing finished.\n')
print('Writing to files...')
result_json = df.to_json(orient='records', indent=2)
result_parsed = json.loads(result_json)
with open('./stars.json', 'w') as out:
	out.write(result_json)

result_json = df['id'].to_json(orient='values', indent=2)
with open('./ids.json', 'w') as out:
	out.write(result_json)
print('Completed.\n')