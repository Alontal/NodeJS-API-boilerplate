module.exports = {
    "env": {
        "node": true,
        "commonjs": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
        "indent": [
            "error",
            "tab"
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single",{
                "allowTemplateLiterals": true,
            }
        ],
        "semi": [
            "error",
            "always"
        ],
    "plugins": ["prettier"],
        "rules": {
          "prettier/prettier": "error"
        }
    },
    "plugins": [
        "security"
    ],
    "extends": [
        "plugin:security/recommended"
    ]
};