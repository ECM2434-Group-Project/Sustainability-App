'use client'

import { IoCloseSharp } from "react-icons/io5"

import styles from "./Popup.module.css"


export function Popup({ trigger, setTrigger, size="medium", children }) {
    return trigger ? (
        <section className={size === "small" ? styles.containerSmall : size === "medium" ? styles.container : size === "large" ? styles.containerLarge : styles.container }>
            <div className={styles.popup}>
                <button
                    className={styles.close}
                    onClick={() => setTrigger(false)}
                >
                    <IoCloseSharp />
                </button>
                {children}
            </div>
        </section>
    ) : (
        <></>
    )
}