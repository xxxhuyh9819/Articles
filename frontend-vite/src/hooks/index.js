import { useEffect, useState } from "react"

/**
 * A custom hook used to access and update states saved in localStorage
 */
const useLocalStorage = (key, initialState) => {
    const [value, setValue] = useState(
        JSON.parse(localStorage.getItem(key) || null) || initialState
    )

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value))
    },  [value])

    return [value, setValue]
}

export {useLocalStorage}