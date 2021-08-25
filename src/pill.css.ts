import { style } from '@vanilla-extract/css';

// It's easier to calculate sizes of pills when they not rely on margins (that's why there is wrapper element doing the "margins" with padding).
// getBoundingClientRect() returns the dimensions of the element, but without margins (there is no pleasant way to reliably get the rendered margins of the element in JS).
// Alternatively we could share some margin variable between styles and calculations, but that limits our options in CSS (require usage of pixels for margin).
export const pillStyle = style({
  padding: 5,
  display: 'inline-block',
});

export const pillWithHeaderStyle = style({});

export const buttonStyle = style({
  borderRadius: 4,
  border: '1px solid #000',
  margin: 0,
  padding: 2,
  position: 'relative',

  selectors: {
    [`${pillWithHeaderStyle} &`]: {
      paddingLeft: 22,
    },

    [`${pillWithHeaderStyle} &:before`]: {
      display: 'block',
      content: '"H"',
      backgroundColor: 'orange',
      color: 'black',
      position: 'absolute',
      top: 2,
      left: 3,
      paddingInline: 3,
      borderRadius: 2,
    },
  },
});
