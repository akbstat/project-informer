import { Autocomplete, Chip, TextField } from "@mui/material";

export default function LeaderBinder({ label, options, bind, defaultValue }: {
    label: string,
    options: string[],
    bind: (leaders: string[]) => void,
    defaultValue: string[]
}) {
    const onChange = (_event: React.SyntheticEvent, value: string[]) => {
        bind(value);
    }
    return (
        <Autocomplete
            fullWidth
            freeSolo
            disableClearable
            multiple
            options={options}
            onChange={onChange}
            value={defaultValue}
            renderValue={(value: readonly string[], getItemProps) =>
                value.map((option: string, index: number) => {
                    const { key, ...itemProps } = getItemProps({ index });
                    return (
                        <Chip variant="outlined" label={option} key={key} {...itemProps} />
                    );
                })
            }
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    slotProps={{
                        input: {
                            ...params.InputProps,
                            type: "search",
                        },
                    }}
                />
            )}
            size="small" id="blind-leaders"
        />
    );
}