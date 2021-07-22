from astroquery.simbad import Simbad
import pandas as pd
import json

def clamp(n, smallest, largest): 
	return max(smallest, min(n, largest))

def temp(bv):
	temp = clamp(4600 * (1 / (0.92 * bv + 1.7) + 1 / (0.92 * bv + 0.62)), 1000, 40000)
	return round(temp / 100.0) * 100

tempToColor = pd.read_csv('tempToColor.csv', index_col='K')

managedSimbad = Simbad()

managedSimbad.ROW_LIMIT = 1000
managedSimbad.remove_votable_fields('coordinates')
managedSimbad.add_votable_fields('distance', 'ra(d)','dec(d)', 'flux(B)', 'flux(V)')

result_table = managedSimbad.query_objects(["M 8"])
# result_table = managedSimbad.query_catalog('hip')
result_df = result_table.to_pandas()

result_df.rename(columns = {'MAIN_ID':'id', 
							'Distance_distance': 'dist', 
							'RA_d': 'ra', 
							'DEC_d': 'dec',
							'FLUX_B': 'flux (b)',
							'FLUX_V': 'flux (v)'}, inplace = True)

result_df = result_df[['id', 'dist', 'ra', 'dec', 'flux (b)', 'flux (v)']];

# result_df = result_df[result_df['dist'].notna()]

result_df['flux'] = result_df['flux (b)'] - result_df['flux (v)']
result_df['color'] = result_df['flux'].apply(lambda bv: tempToColor.loc[temp(bv)])
result_df = result_df.drop(['flux (b)', 'flux (v)', 'flux'], axis=1)

result_json = result_df.to_json(orient='records', indent=2)
result_parsed = json.loads(result_json)

with open("./stars.json", "w") as out:
	out.write(result_json)