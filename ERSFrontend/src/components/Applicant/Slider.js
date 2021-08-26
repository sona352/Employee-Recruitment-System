import React from "react";
import InputRange from "react-input-range";
import 'react-input-range/lib/css/index.css';
import "./Slider.css";


class Slider extends React.Component {
  onChange = range => {
    this.props.onChange({
      value: range
    });
  }
  render() {
    const value = this.props.data;
    return (
      <div className="slider">
        <InputRange
          minValue={1}
          maxValue={30}
          step={1}
          onChange={this.props.onChange}
          value={value}
        />
      </div>
    )
  }
}

export default Slider;