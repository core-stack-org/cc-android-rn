import React from "react";
import { shallow } from "enzyme";
import LocationSelection from "./LocationSelection";

describe("LocationSelection", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<LocationSelection />);
    expect(wrapper).toMatchSnapshot();
  });
});
