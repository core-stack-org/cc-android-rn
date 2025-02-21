import React from "react";
import { shallow } from "enzyme";
import Maps from "./Maps";

describe("Maps", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<Maps />);
    expect(wrapper).toMatchSnapshot();
  });
});
