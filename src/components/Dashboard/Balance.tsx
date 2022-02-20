import { Box, List, ListItem, ListItemIcon, ListItemText, ListItemProps, Collapse } from "@mui/material";
import { COLOR } from "@utils/theme/constants";
import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as IconArrowUp } from "@assets/images/icon-arrow-up.svg";
import { useState } from "react";
import { BoxProps } from "@mui/system";

interface Data {
  sectionHeader?: boolean;
  label: string;
  value?: string;
}

interface Props {
  data: Data[];
}

export default function Balance({ data }: Props) {

  const [showMore, setShowMore] = useState(false)

  const CustomListItem = ({ sectionHeader, label, value }: Data) => (
    <ListItem sx={{
      p: 0,
      pl: sectionHeader ? 1 : 2,
      pr: 1,
      // mt: '-5px'
    }}>
      <ListItemIcon
        sx={{
          color: COLOR.text,
          fontSize: sectionHeader ? 14 : 12,
          opacity: sectionHeader ? 1 : 0.5,
        }}
      >
        {label}
      </ListItemIcon>
      <ListItemText
        primary={value}
        sx={{
          textAlign: "right",
          color: COLOR.text,
          fontSize: sectionHeader ? 14 : 12,
          opacity: sectionHeader ? 1 : 0.5,
        }}
      />
    </ListItem>
  )

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column'
    }}>
      <List sx={{
        height: showMore ? '100%' : '100%',
        // height: '100%',
        overflow: 'hidden',
        // pb: '24px',
        position: 'relative'
      }} dense disablePadding>
        {data.map(({ sectionHeader, label, value }) => (
          sectionHeader ? <CustomListItem key={label} sectionHeader={sectionHeader} label={label} value={value} />
            :
            <Collapse key={label} in={showMore} timeout="auto" unmountOnExit>
              <CustomListItem sectionHeader={sectionHeader} label={label} value={value} />
            </Collapse>
        ))}
      </List >
      <Box onClick={() => {
        setShowMore(!showMore)
      }} sx={{
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 0,
        left: 0,
        right: 0,
        height: '24px',
        fontSize: '10px',
        // position: 'absolute',
        backgroundColor: 'rgba(16, 38, 55, 1)'
      }}>
        {showMore ? 'Show Less' : 'Show More'}
        <SvgIcon
          sx={{
            ml: 1,
            width: 6,
            height: 6,
            transition: "transform ease 0.25s",
            transform: !showMore ? "rotate(180deg)" : undefined,
          }}
        >
          <IconArrowUp />
        </SvgIcon>
      </Box>
    </Box>
  );
}






{/* <Box onClick={() => {
  setShowMore(!showMore)
}} sx={{
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  bottom: 0,
  left: 0,
  right: 0,
  height: '24px',
  fontSize: '10px',
  position: 'absolute',
  backgroundColor: 'rgba(16, 38, 55, 1)'
}}>
  Show More
  <SvgIcon
    sx={{
      ml: 1,
      width: 6,
      height: 6,
      transition: "transform ease 0.25s",
      transform: !showMore ? "rotate(180deg)" : undefined,
    }}
  >
    <IconArrowUp />
  </SvgIcon>
</Box> */}