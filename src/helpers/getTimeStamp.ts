const getTimeStamp = () => {
	const now = new Date();
	const year = now.getFullYear();
	const month = now.getMonth() + 1;
	const date = now.getDate();
	const hours = now.getHours();
	const minutes = now.getMinutes() < 10 ? `0${now.getMinutes()}` : now.getMinutes();
	const seconds = now.getSeconds() < 10 ? `0${now.getSeconds()}` : now.getSeconds();

	return `${year}-${month}-${date}T${hours}:${minutes}:${seconds}`;
};

export default getTimeStamp;
