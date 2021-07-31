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

tempToColor = pd.read_csv('./data/tempToColor.csv', index_col='K')

df = pd.read_csv('./data/hygdata_v3.csv', header=0)

print('Processing data...')
df.drop('id', axis=1, inplace=True)


def setname(row):
	if (row['proper'] != -1):
		return row['proper']
	elif (row['hip'] != -1):
		return 'HIP ' + str(int(row['hip']))
	elif (row['hd'] != -1):
		return 'HD ' + str(int(row['hd']))
	elif (row['hr'] != -1):
		return 'HR ' + str(int(row['hr']))
	elif (row['gl'] != -1):
		return row['gl']
	elif (row['bf'] != -1):
		return row['bf']


names_columns = ['proper','hip','hd','hr','gl','bf']
df[names_columns] = df[names_columns].fillna(-1)

df['name'] = df.apply(lambda row: setname(row), axis=1)

df.rename(columns = {'mag': 'appMag', 'absmag': 'absMag', 'ci': 'B-V'}, inplace=True)
df['ra'] = df['ra'] * 15; # convert ra from hours to degrees

print('Data processing finished.\n')

print('Processing color...')
df['color'] = df['B-V'].apply(lambda bv: tempToColor.loc[temp(bv)])

# for HYG catalogue
df.reset_index(inplace=True)
df.rename(columns = {'index': 'id'}, inplace=True)
df = df[['id', 'name', 'ra', 'dec', 'appMag', 'absMag', 'dist', 'color']]




dfs = np.array_split(df, 11)
print('Color processing finished.\n')

print('Writing to files...')
'''
# WRITE WHEN COLUMNS ARE NEEDED
columns = df.to_json(orient='split')
columns = json.loads(columns)
columns = columns['columns']
columns = json.dumps(columns)


print('\tWriting to ./data/columns.json...')
with open('./data/columns.json', 'w') as out:
	out.write(columns)
'''

for d in range(len(dfs)):
	fname = './data/stars_' + str(d) + '.json'
	print('\tWriting to ' + fname + '...')
	with open('./data/stars_' + str(d) + '.json', 'w') as out:
		out.write(dfs[d].to_json(orient='values'))

print('Completed.\n')