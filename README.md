# tilelive-AsMVT

Tilelive module for generating Mapbox Vector Tiles from a Postgres DB using ST_AsMVT.

Requires a postgres function that takes 3 int arguments(zoom, x, y) and returns vector tile data to exist. It is suitable for use with functions generated by the [generate-sqltomvt tool](https://github.com/openmaptiles/openmaptiles-tools/blob/master/bin/generate-sqltomvt) from the [OpenMapTiles](https://github.com/openmaptiles/) project, or other a custom function with a similar signature.

## Example function

```
CREATE OR REPLACE FUNCTION gettile(zoom integer, x integer, y integer)
RETURNS bytea AS $$
    ST_AsMVT(t, 'admin', 4096, 'mvtgeometry'), '') as mvtl FROM (
        SELECT ST_AsMVTGeom(geometry, ST_TileEnvelope(zoom, x, y), 4096, 4, true) AS mvtgeometry, id, name
        FROM my_table WHERE geometry && ST_TileEnvelope(zoom, x, y);
$$ LANGUAGE SQL STABLE RETURNS NULL ON NULL INPUT;
```

## Example source url:

`asmvt:///?host=localhost&user=postgres&database=osm&port=15432&function=gettile`

## Query parameters:

- `user` - postgres user, defaults to `PGUSER` environment variable if not provided.
- `host` - postgres host, defaults to `PGHOST` environment variable if not provided.
- `database` - database name, defaults to `PGDATABASE` environment variable if not provided.
- `password` - postgres password, defaults to `PGPASSWORD` environment variable if not provided.
- `port` - postgres port, defaults to `PGPORT` environment variable if not provided.
- `function` - name of database function that returns tile data, defaults to `gettile` if not provided.
