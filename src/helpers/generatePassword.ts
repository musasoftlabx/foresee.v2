// * NPM
import randomstring from "randomstring";
import shuffle from "lodash/shuffle";

export default function GeneratePassword() {
  const challenge =
    randomstring.generate({
      charset: "alphabetic",
      length: 2,
      readable: true,
      capitalization: "uppercase",
    }) +
    randomstring.generate({
      charset: "alphabetic",
      length: 2,
      readable: true,
      capitalization: "lowercase",
    }) +
    randomstring.generate({
      charset: "numeric",
      length: 2,
      readable: true,
    }) +
    randomstring.generate({
      charset: "!@#$%^&*-_=+<>",
      length: 2,
    });

  return shuffle(challenge).join("");
}
