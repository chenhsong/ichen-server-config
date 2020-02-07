import * as Terminal from "../terminal-config"

function splitMaps(maps: Terminal.IClassMap[])
{
	const new_maps: Terminal.IClassMap[] = [];

	maps.forEach(map =>
	{
		if (map.hasOwnProperty("value")) {
			const val = (map as Terminal.IClassMapValueBase).value;

			if (Array.isArray(val)) {
				val.forEach(x =>
				{
					const new_map: Terminal.IClassMap = { value: x, class: map.class };
					if (map.hasOwnProperty("field")) new_map.field = map.field;
					new_maps.push(new_map);
				});
			} else {
				const new_map: Terminal.IClassMap = { value: val, class: map.class };
				if (map.hasOwnProperty("field")) new_map.field = map.field;
				new_maps.push(new_map);
			}
		} else if (map.hasOwnProperty("notValue")) {
			const val = (map as Terminal.IClassMapNegatedValueBase).notValue;
			const new_map: Terminal.IClassMap = { notValue: val, class: map.class };
			if (map.hasOwnProperty("field")) new_map.field = map.field;
			new_maps.push(new_map);
		}
	});

	return new_maps;
}

function normalizeMaps(maps: Terminal.IClassMap | Terminal.IClassMap[])
{
	// Normalize the value maps
	if (Array.isArray(maps)) {
		return splitMaps(maps);
	} else {
		return splitMaps([maps]);
	}
}

export default function normalizeConfig(config: Terminal.IConfig)
{
	config.controllers.default.lines.filter(line => line.maps).forEach(line => line.maps = normalizeMaps(line.maps!));
	if (config.controllers.default.maps) {
		config.controllers.default.maps = normalizeMaps(config.controllers.default.maps);
	}
	return config;
}
