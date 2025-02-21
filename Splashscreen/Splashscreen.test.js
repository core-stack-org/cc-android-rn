import React from "react";
import { shallow } from "enzyme";
import Splashscreen from "./Splashscreen";

describe("Splashscreen", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<Splashscreen />);
    expect(wrapper).toMatchSnapshot();
  });
});
