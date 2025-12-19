"use client";

import { useSelectionContext } from "./contexts";
import React from "react";
import { Box, List, ListItem, ListItemButton, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { Product } from "@/data/repository/entity";

export default function MenuList({ className }: { className: string }) {
    const { push } = useRouter();
    const { versionId } = useSelectionContext();
    const [products, setProducts] = React.useState<Product[]>([]);
    const [pruductId, setPruductId] = React.useState<number | undefined>(undefined);
    React.useEffect(() => {
        if (!versionId) {
            return;
        }
        const fetchData = async () => {
            const reply = await fetch(`/api/product?version=${versionId}`);
            const p: Product[] = (await reply.json()).data;
            p.sort((x, y) => x.name < y.name ? -1 : 1);
            setProducts(p);
            const firstProduct = p[0];
            if (firstProduct) {
                setPruductId(firstProduct.id);
                push(`/${firstProduct.id}`);
            }
        }
        fetchData();
    }, [versionId, push]);


    const handleListItemClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, id: number) => {
        setPruductId(id);
        push(`/${id}`);
    }

    return (
        <Box className={className} sx={{ borderColor: "primary.main", borderWidth: "1px", height: "90vh", borderTopWidth: "0px", overflow: 'auto', }}>
            <List>
                {
                    products.map(m => {
                        return (
                            <ListItem disablePadding key={m.id} >
                                <ListItemButton selected={m.id === pruductId} onClick={(event) => handleListItemClick(event, m.id)}>
                                    <Typography color="primary.main" variant="subtitle1" gutterBottom>
                                        {m.name}
                                    </Typography>
                                </ListItemButton>
                            </ListItem >
                        );
                    })
                }
            </List>
        </Box>
    );
}

