export const Colors = {
  black: 'black',
  white: 'white',
  gray: {
    bold: '#333',
    semiBold: '#777',
    medium: '#999',
    regular: '#ccc',
    light: '#eee',
  },
  state: {
    premium: '#00c5ff',
    alert: '#e24d4d',
  },
}

export const Units = {
  base: 10,
}

export const Border = {
  borderWidth: 1.5,
  borderColor: Colors.gray.regular,
  borderRadius: 3,
}

export const Typography = {
  fontWeight: {
    normal: 'normal', // 400
    medium: '500',
    bold: 'bold', // 700
  },
  fontSize: {
    base: 17,
    small: 15,
    xsmall: 12,
  },
  lineHeight: {
    base: null, // TODO
  },
}