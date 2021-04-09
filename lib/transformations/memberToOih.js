/* eslint prefer-destructuring: "off" */

module.exports.memberToOih = (msg) => {
  if (Object.keys(msg).length === 0 && msg.constructor === Object) {
    return msg;
  }

  const person = {
    contactData: [
      {
        type: 'email',
        value: msg.email_address,
      },
    ],
  };

  if (msg.merge_fields) {
    person.firstName = msg.merge_fields.FNAME;
    person.lastName = msg.merge_fields.LNAME;
    person.birthday = msg.merge_fields.BIRTHDAY;

    person.contactData.push({
      type: 'phone',
      value: msg.merge_fields.PHONE,
    });

    if (msg.merge_fields.ADDRESS) {
      const address = {
        street: msg.merge_fields.ADDRESS.addr1,
        streetNumber: msg.merge_fields.ADDRESS.addr2,
        city: msg.merge_fields.ADDRESS.city,
        state: msg.merge_fields.ADDRESS.state,
        zipcode: msg.merge_fields.ADDRESS.zip,
        country: msg.merge_fields.ADDRESS.country,
      };

      for (const key in address) {
        if (key && key !== '') {
          person.addresses = [
            address,
          ];
          break;
        }
      }
    }
  }

  const expression = {
    metadata: {
      recordUid: msg.id,
    },
    data: person,
  };

  // Remove null values
  Object.keys(expression.data).forEach(
    key => (expression.data[key] == null || expression.data[key] === undefined)
      && delete expression.data[key],
  );

  return expression;
};
