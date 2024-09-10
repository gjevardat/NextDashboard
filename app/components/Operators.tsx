import React, { useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';

export default function Operators()  {
  // Define the initial items and state for checked items
  const [checked, setChecked] = useState<number[]>([]);

  // Define the list items
  const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];

  // Handle toggle event
  const handleToggle = (index: number) => {
    const currentIndex = checked.indexOf(index);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(index); // Add the item if not checked
    } else {
      newChecked.splice(currentIndex, 1); // Remove the item if already checked
    }

    setChecked(newChecked); // Update the state
  };

  return (
    <List>
      {items.map((item, index) => {
        const labelId = `checkbox-list-label-${index}`;

        return (
          <ListItem key={index} role={undefined} dense button onClick={() => handleToggle(index)}>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={checked.indexOf(index) !== -1}
                tabIndex={-1}
                disableRipple
                inputProps={{ 'aria-labelledby': labelId }}
              />
            </ListItemIcon>
            <ListItemText id={labelId} primary={item} />
          </ListItem>
        );
      })}
    </List>
  );
};
