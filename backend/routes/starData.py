from astroquery.simbad import Simbad
import json

managedSimbad = Simbad()

managedSimbad.ROW_LIMIT = 3000
managedSimbad.add_votable_fields('distance')

result_table = managedSimbad.query_objects(["Vega", "Capella"])
result_json = result_table.to_pandas().to_json(orient='records', indent=2)
result_parsed = json.loads(result_json)

with open("../../frontend/assets/stars.json", "w") as out:
	out.write(result_json)

# 360/24 = 15 so each hour is 15 degrees
# 360/(24*60) = 0.25 so each minute is 0.25 degrees
# 360/(24*60*60) = 0.0041666_ so each second is 0.0041666_

# Simbad.list_votable_fields()