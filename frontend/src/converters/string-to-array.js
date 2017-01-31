export class StringToArrayValueConverter {
  toView(value) {
    var values = [];
    if(!value)
      return values;
    for (var val of value.split('\n'))
      values.push({'url':val});
    return values
  }
}