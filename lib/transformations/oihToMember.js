/* eslint prefer-destructuring: "off" */

module.exports.memberToOih = (msg) => {
  const person = msg.data;

  // Mailchimp entries must have at least one email address
  if (!person || !person.contactData || !person.contactData.length) {
    return false;
  }

  const email = person.contactData.find(entry => entry.type === 'email');
  if (!email) return false;

  const body = {
    email_address: email.value,
    status: 'pending',
    merge_fields: {
      FNAME: person.firstName,
      LNAME: person.lastName,
      BIRTHDAY: person.birthday,
    },
  };

  const expression = {
    metadata: msg.metadata,
    data: body,
  };

  // Remove null values
  Object.keys(expression.data).forEach(
    key => (expression.data[key] == null || expression.data[key] === undefined)
      && delete expression.data[key],
  );

  return expression;
};
