import { X } from "lucide-react";
import ModalStyle from "../Modal/ModalStyle.module.css";

function DeleteModal({ onCloseProp }: { onCloseProp: (confirmDelete: boolean) => void }) {
    return (
        <>
            <div className={ModalStyle.pageBody}>
                <div className={ModalStyle.textBoxStyle}>
                    <button className={ModalStyle.btnCancel} onClick={() => onCloseProp(false)} style={{ background: "none", color: "#1e1e1e" }}><X /></button>
                    <h1 style={{ marginBottom: "1rem", marginTop:"2rem" }}>Bekräfta radering</h1>
                    <br />
                    <p style={{ textAlign: "center", display:"block" }}>Är du säker på att du vill ta bort recensionen?</p>
                    <br />
                    <div className={ModalStyle.modalBtn}>
                        <button onClick={() => onCloseProp(false)}>Ångra</button>
                        <button onClick={() => onCloseProp(true)}>Ta bort</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DeleteModal