import { TextField } from "@mui/material";
import { useEffect, useState } from "react";

export default function Filters() {    
    const [emailFilter, setEmailFilter] = useState('');
    const onEmailFilterValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmailFilter(event.target.value);
    }

    useEffect(() => {
                const tr = document.querySelectorAll('tbody tr');
                tr.forEach((row) => {
                    const email = row.querySelector('td:nth-child(3)')?.textContent;
                    if (email && email.includes(emailFilter)) {
                        (row as any).style.display = '';
                    } else {
                        (row as any).style.display = 'none';
                    }
                }
                );
    
        }, [emailFilter]);
        return (
            <TextField value={emailFilter} onChange={onEmailFilterValueChange} fullWidth label="Email" id="emailFilter"  />
        )
}