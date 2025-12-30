import { Box, Chip, Stack, styled } from "@mui/material";

export default function LeaderTag({ leader, fontsizeTimes }: { leader: string, fontsizeTimes: number }) {
    if (leader.length === 0) {
        return (<></>);
    }
    const leaders = leader.split("|");

    const LeaderChip = styled(Chip)({
        fontSize: `${14 * fontsizeTimes}px`,
        height: `${30 * fontsizeTimes}px`,
    });
    const blindLeaders = leaders[0].split(", ").map((leader, index) => <LeaderChip color="primary" key={index} label={leader} variant="outlined" />);
    const unblindLeaderKeyBase = leaders[0].split(", ").length;
    const unblindLeaders = leaders.length > 1 ? leaders[1].split(", ").map((leader, index) => <LeaderChip color="primary" key={index + unblindLeaderKeyBase} label={leader} />) : [];
    return (
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            {[...blindLeaders, ...unblindLeaders]}
        </Stack>
    );
}