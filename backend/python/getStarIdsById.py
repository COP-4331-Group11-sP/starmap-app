import sys, getopt
from astroquery.simbad import Simbad

def main(argv):
    star_id = argv
    id_table = Simbad.query_objectids(star_id)
    id_json = id_table.to_pandas()['ID'].to_json(orient='values')
    print(id_json)


if __name__ == '__main__':
    main(sys.argv[1])

