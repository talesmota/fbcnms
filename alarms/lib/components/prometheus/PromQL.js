function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */
export class Function {
  constructor(name, args) {
    _defineProperty(this, "name", void 0);

    _defineProperty(this, "arguments", void 0);

    this.name = name;
    this.arguments = args;
  }

  toPromQL() {
    return `${this.name}(` + this.arguments.map(arg => arg.toPromQL()).join(',') + ')';
  }

}
export class InstantSelector {
  constructor(selectorName, labels, offset) {
    _defineProperty(this, "selectorName", void 0);

    _defineProperty(this, "labels", void 0);

    _defineProperty(this, "offset", void 0);

    this.selectorName = selectorName;
    this.labels = labels || new Labels();
    this.offset = offset;
  }

  toPromQL() {
    return (this.selectorName || '') + (this.labels ? this.labels.toPromQL() : '') + (this.offset ? ' offset ' + this.offset.toString() : '');
  }

  setOffset(offset) {
    this.offset = offset;
    return this;
  }

}
export class RangeSelector extends InstantSelector {
  constructor(selector, range) {
    super(selector.selectorName, selector.labels);

    _defineProperty(this, "range", void 0);

    this.range = range;
  }

  toPromQL() {
    return `${super.toPromQL()}[${this.range.toString()}]`;
  }

}
export class Range {
  constructor(value, unit) {
    _defineProperty(this, "unit", void 0);

    _defineProperty(this, "value", void 0);

    this.unit = unit;
    this.value = value;
  }

  toString() {
    return this.value + this.unit;
  }

}
/**
 * The modifier methods of Labels mutate the underlying data
 * and return `this` to enable chaining on constructors.
 */

export class Labels {
  constructor(labels) {
    _defineProperty(this, "labels", void 0);

    this.labels = labels || [];
  }

  toPromQL() {
    if (this.labels.length === 0) {
      return '';
    }

    return '{' + this.labels.map(label => label.toString()).join(',') + '}';
  }

  addLabel(name, value, operator) {
    this.labels.push(new Label(name, value, operator));
  }

  addEqual(name, value) {
    this.labels.push(new Label(name, value, '='));
    return this;
  }

  addNotEqual(name, value) {
    this.labels.push(new Label(name, value, '!='));
    return this;
  }

  addRegex(name, value) {
    this.labels.push(new Label(name, value, '=~'));
    return this;
  }

  addNotRegex(name, value) {
    this.labels.push(new Label(name, value, '!~'));
    return this;
  }

  setIndex(i, name, value, operator) {
    if (i >= 0 && i < this.len()) {
      this.labels[i].name = name;
      this.labels[i].value = value;
      this.labels[i].operator = operator || this.labels[i].operator;
    }

    return this;
  }

  remove(i) {
    if (i >= 0 && i < this.len()) {
      this.labels.splice(i, 1);
    }

    return this;
  }

  removeByName(name) {
    this.labels = this.labels.filter(label => label.name !== name);
    return this;
  }

  len() {
    return this.labels.length;
  }

  copy() {
    const ret = new Labels();
    this.labels.forEach(label => {
      ret.addLabel(label.name, label.value, label.operator);
    });
    return ret;
  }

}
export class Label {
  constructor(name, value, operator) {
    _defineProperty(this, "name", void 0);

    _defineProperty(this, "value", void 0);

    _defineProperty(this, "operator", void 0);

    this.name = name;
    this.value = value;
    this.operator = operator;
  }

  toString() {
    return `${this.name}${this.operator}"${this.value}"`;
  }

}
export class Scalar {
  constructor(value) {
    _defineProperty(this, "value", void 0);

    this.value = value;
  }

  toPromQL() {
    return this.value.toString();
  }

}
export class BinaryOperation {
  constructor(lh, rh, operator, clause) {
    _defineProperty(this, "lh", void 0);

    _defineProperty(this, "rh", void 0);

    _defineProperty(this, "operator", void 0);

    _defineProperty(this, "clause", void 0);

    this.lh = lh;
    this.rh = rh;
    this.operator = operator;
    this.clause = clause;
  }

  toPromQL() {
    return `${this.lh.toPromQL()} ${this.operator.toString()} ` + (this.clause ? this.clause.toString() + ' ' : '') + `${this.rh.toPromQL()}`;
  }

}
export class BinaryComparator {
  constructor(op) {
    _defineProperty(this, "op", void 0);

    _defineProperty(this, "boolMode", void 0);

    this.op = op;
    this.boolMode = false;
  }

  makeBoolean() {
    this.boolMode = true;
    return this;
  }

  makeRegular() {
    this.boolMode = false;
    return this;
  }

  toString() {
    return this.boolMode ? `${this.op} bool` : this.op;
  }

}
export class VectorMatchClause {
  constructor(matchClause, groupClause) {
    _defineProperty(this, "matchClause", void 0);

    _defineProperty(this, "groupClause", void 0);

    this.matchClause = matchClause;
    this.groupClause = groupClause;
  }

  toString() {
    return this.matchClause.toString() + (this.groupClause ? ' ' + this.groupClause.toString() : '');
  }

}
export class Clause {
  constructor(operator, labelList = []) {
    _defineProperty(this, "operator", void 0);

    _defineProperty(this, "labelList", void 0);

    this.operator = operator;
    this.labelList = labelList;
  }

  toString() {
    return this.operator + (this.labelList.length > 0 ? ` (${this.labelList.join(',')})` : '');
  }

}
export class AggregationOperation {
  constructor(name, parameters, clause) {
    _defineProperty(this, "name", void 0);

    _defineProperty(this, "parameters", void 0);

    _defineProperty(this, "clause", void 0);

    this.name = name;
    this.parameters = parameters;
    this.clause = clause;
  }

  toPromQL() {
    return `${this.name}(` + this.parameters.map(param => param.toPromQL()).join(',') + ')' + (this.clause ? ' ' + this.clause.toString() : '');
  }

}
export class String {
  constructor(value) {
    _defineProperty(this, "value", void 0);

    this.value = value;
  }

  toPromQL() {
    return `"${this.value}"`;
  }

}
export class SubQuery {
  constructor(expr, range, resolution, offset) {
    _defineProperty(this, "expr", void 0);

    _defineProperty(this, "range", void 0);

    _defineProperty(this, "resolution", void 0);

    _defineProperty(this, "offset", void 0);

    this.expr = expr;
    this.range = range;
    this.resolution = resolution;
    this.offset = offset;
  }

  withOffset(offset) {
    this.offset = offset;
    return this;
  }

  toPromQL() {
    const maybeStep = this.resolution != null ? this.resolution.toString() : '';
    return `${this.expr.toPromQL()}[${this.range.toString()}:${maybeStep}]` + (this.offset ? ' offset ' + this.offset.toString() : '');
  }

}