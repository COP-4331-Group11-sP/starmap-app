import { StyleSheet } from "react-native";

const colors = {
  primary: "#d8e3e1",
  secondary: "#839997",
  tertiary: "#334f59",
};

const page = StyleSheet.create({
  centerer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  color: {
    backgroundColor: colors.tertiary,
    color: colors.primary,
  },
  icon: {
    tintColor: colors.primary,
    width: 50,
    height: 50,
  }
});

const text = StyleSheet.create({
	normal: {
    fontSize: 14,
  },
  large: {
    fontSize: 36,
  },
  title: {
    fontFamily: "monospace",
  },
  left: {
    textAlign: "left",
  },
  center: {
    textAlign: "center",
  },
  right: {
    textAlign: "right",
  }
});

const spacing = StyleSheet.create({
	m1: {
		margin: 5
	},
	m2: {
		margin: 10
	},
	m3: {
		margin: 15
	},
	p1: {
		padding: 5
	},
	p2: {
		padding: 10
	},
	p3: {
		padding: 15
	},
	mv1: {
		marginTop: 5,
		marginBottom: 5
	},
	mv2: {
		marginTop: 10,
		marginBottom: 10
	},
	mv3: {
		marginTop: 15,
		marginBottom: 15
	}
});

export { colors, page, text ,spacing };