
// JSON API calls
const writeToMem = async () => {
    try {
        const data = { num: String(inputField) }
        const response = await fetch(
            `http://localhost:4000/write_mem`,
            {
                method: "POST",
                headers: { 'Content-type': 'application/json', },
                body: JSON.stringify(data)
            }
        );
    } catch (error) {
        console.log(error.message);
    }
}

const recallFromMem = async () => {
    try {
        const response = await fetch(
            `http://localhost:4000/read_mem`,
            {
                method: "GET",
                headers: { 'Content-type': 'application/json', }
            }
        );
        const responseData = await response.json();
        setInputField(responseData.num)
    } catch (error) {
        console.log(error.message);
    }
}