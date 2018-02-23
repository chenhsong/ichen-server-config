function splitMaps(maps: Terminal.IClassMap[])
{
	const newmaps: Terminal.IClassMap[] = [];

	maps.forEach(map =>
	{
		if (map.hasOwnProperty("value")) {
			const val = (map as Terminal.IClassMapValueBase).value;

			if (Array.isArray(val)) {
				val.forEach(x =>
				{
					const newmap: Terminal.IClassMap = { value: x, class: map.class };
					if (map.hasOwnProperty("field")) newmap.field = map.field;
					newmaps.push(newmap);
				});
			} else {
				const newmap: Terminal.IClassMap = { value: val, class: map.class };
				if (map.hasOwnProperty("field")) newmap.field = map.field;
				newmaps.push(newmap);
			}
		} else if (map.hasOwnProperty("notValue")) {
			const val = (map as Terminal.IClassMapNegatedValueBase).notValue;
			const newmap: Terminal.IClassMap = { notValue: val, class: map.class };
			if (map.hasOwnProperty("field")) newmap.field = map.field;
			newmaps.push(newmap);
		}
	});

	return newmaps;
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
