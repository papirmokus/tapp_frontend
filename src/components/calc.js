import React, { useState } from 'react';


const Calc = () => {
    const [inputField, setInputField] = useState('')
    const [historyField, setHistoryField] = useState('')
    const [latestOperator, setLatestOperator] = useState('')


    //  Input events

    /**
     * Best regex for validating input during typing:
     * "(^-?([0-9]+([.,][0-9]*)?|[.][0-9]+)$)|^-?$"
     */

    const handleChange = (e) => {
        const regexp = "(^-?([0-9]+([.][0-9]*)?|[.][0-9]+)$)|^-?$"
        const { id, value, type } = e.target
        let newValue = value
        if (type === "button") {
            newValue = inputField + id
        }
        if (newValue.match(regexp)) {
            setInputField(newValue)
        }
    }

    const handleDecimalClick = (e) => {
        inputField ? setInputField(inputField + '.') : setInputField('0.')
    }

    /**
     * Elif branches
     *  1. Change the latest operator and display accordingly
     *  2. Put the main input to the history with the chosen operator
     *  3. Calculates the result and displays it in history with the new operator
     */
    const handleOperatorClick = (e) => {
        const { id } = e.target
        if (inputField !== '-') {
            if (!inputField && historyField) {
                const oldHistoryFiled = parseFloat(historyField)
                setHistoryField(`${oldHistoryFiled}  ${id}`)
                setLatestOperator(id)
            } else if (inputField && !historyField) {
                setHistoryField(`${parseFloat(inputField)}  ${id}`)
                setLatestOperator(id)
                setInputField('')
            } else if (inputField && historyField) {
                const result = performOperation(latestOperator)
                setLatestOperator(id)
                setHistoryField(`${result}  ${id}`)
                setInputField('')
            }
        }
    }

    const handleEqualsClick = (e) => {
        if (historyField && inputField) {
            const result = performOperation(latestOperator)
            setInputField(result)
            setHistoryField('')
        } else if (historyField) {
            setInputField(parseFloat(historyField))
        }
    }

    const handleClearClick = (e) => {
        setHistoryField('')
        setInputField('')
        setLatestOperator('')
    }


    //Creating numbered buttons
    const nums = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '00']

    const numButtons = nums.map(i => {
        return <button type="button" onClick={handleChange} key={i} id={i}>{i}</button>
    })

    // Calculate and return the result
    const performOperation = (op) => {
        switch (op) {
            case '*':
                return parseFloat(historyField) * parseFloat(inputField)
            case '/':
                return parseFloat(historyField) / parseFloat(inputField)
            case '-':
                return parseFloat(historyField) - parseFloat(inputField)
            case '+':
                return parseFloat(historyField) + parseFloat(inputField)
            default:
                return 0
        }
    }

    //API calls
    const recallFromMem = () => {
        fetch("http://localhost:4000/read_mem", { method: "GET" })
            .then(response => response.text())
            .then(result => setInputField(result))
            .catch(error => console.log('error', error));
    }
    const writeToMem = async () => {
        fetch(`http://localhost:4000/write_mem/${inputField}`, { method: "POST" })
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    }


    return (
        <div className="calc-container">
            <input
                type="text"
                value={historyField}
                className="calc-screen-upper"
                disabled={true}
            />
            <input
                type="text"
                step="any"
                value={inputField}
                onChange={handleChange}
                className="calc-screen-lower"
            />
            <div className="memory-panel">
                <button onClick={writeToMem}>Mem Save</button>
                <button onClick={recallFromMem}>Mem Recall</button>
                <button id={'C'} className="all-clear" onClick={handleClearClick}>C</button>
            </div>
            <div className="lower-panel">
                <div className="number-panel">
                    {numButtons}
                    <button type="button" onClick={handleDecimalClick} id={'.'}>.</button>
                </div>
                <div className="operator-panel">
                    <button id={'*'} onClick={handleOperatorClick}>*</button>
                    <button id={'/'} onClick={handleOperatorClick}>/</button>
                    <button id={'-'} onClick={handleOperatorClick}>-</button>
                    <button id={'+'} onClick={handleOperatorClick}>+</button>
                    <button id={'='} className="equal-sign" onClick={handleEqualsClick}>=</button>
                </div>
            </div>
        </div >
    )
}


export default Calc