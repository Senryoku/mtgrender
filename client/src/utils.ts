export function download(filename: string, data: any) {
	const link = document.createElement("a");
	link.download = filename;
	link.href = data;
	link.click();
	link.remove();
}
