export default function cloneObject<T extends {}>(source: T)
{
	const dest = {} as T;
	for (const key in source) (dest as any)[key] = (source as any)[key];
	return dest;
}
