import { useState } from "react";
import styles from "./styles.module.css";



export default function SwitchButton({SwitchOptions}) {
  const [activeOption, setActiveOption] = useState(SwitchOptions.OPTION1);

  const isOption1 = activeOption === SwitchOptions.OPTION1;

  return (
  
      <div className={styles.SwitchContainer}>
       
        <div
          className={styles.ActiveBackground}
          style={{
            transform: isOption1 ? "translateX(0%)" : "translateX(100%)"
          }}
        />

        {/* Option 1 */}
        <div
          className={styles.ToggleItem}
          onClick={() => setActiveOption(SwitchOptions.OPTION1)}
        >
          <div className="Text">{SwitchOptions.OPTION1}</div>
        </div>

        {/* Option 2 */}
        <div
          className={styles.ToggleItem}
          onClick={() => setActiveOption(SwitchOptions.OPTION2)}
        >
          <div className="Text">{SwitchOptions.OPTION2}</div>
        </div>
      </div>
    
  );
}
