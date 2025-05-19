import { useState } from "react"
import styles from "./styles.module.css"
import { Label } from "../Label"

export default function SwitchButton({ options }) {
  const [activeOption, setActiveOption] = useState(options[0].label)

  const isOption1 = activeOption === options[0].label

  return (
    <div className="flex flex-col w-full pl-2">
      <Label label="جستجوی در تمام لیست" />
      <div className={styles.SwitchContainer}>
        <div
          className={styles.ActiveBackground}
          style={{
            transform: isOption1 ? "translateX(0%)" : "translateX(100%)",
          }}
        />

        {/* Option 1 */}
        <div
          className={styles.ToggleItem}
          onClick={() => setActiveOption(options[0].label)}
          style={{
            color: isOption1 ? "#C0C0C0" : "#000",
            zIndex: 1,
          }}
        >
          <div className="Text">{options[0].label}</div>
        </div>

        {/* Option 2 */}
        <div
          className={styles.ToggleItem}
          onClick={() => setActiveOption(options[1].label)}
          style={{
            color: !isOption1 ? "#C0C0C0" : "#000",
            zIndex: 1,
          }}
        >
          <div className="Text">{options[1].label}</div>
        </div>
      </div>
    </div>
  )
}
