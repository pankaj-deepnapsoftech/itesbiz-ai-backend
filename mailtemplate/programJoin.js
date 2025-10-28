const prgJoinTemp = (programName, username, token, agentName) => {
  const html = `
  <p>Dear <strong>${username}</strong></p>
    <p>
      I hope this email finds you well. My name is <strong>${agentName}</strong>, and I am
      contacting you on behalf of <strong>Deepnap Softech</strong>, a leading name in the world
      of innovative technology solutions. We are thrilled to invite you to
      become a valued ${programName} Partner with Deepnap Softech.
    </p>
    <p
    > This is a Verification Mail that confirms you are interested in
      ${programName} Partner.
      <br />Please Verify your Email By Clicking the Below Link:
    </p>
    <p style="margin-bottom: 16px">
      <a
        href="https://www.deepnapsoftech.com/program-confirmation/${token}"
        style="
          background-color: #007bff;
          border-radius: 4px;
          color: #fff;
          display: inline-block;
          font-family: Arial, sans-serif;
          font-size: 16px;
          font-weight: bold;
          padding: 10px 16px;
          text-decoration: none;
        "
        >Confirm Email</a
      >
    </p>
    <p>
      At Deepnap Softech, we pride ourselves on delivering cutting-edge software
      solutions that empower businesses to thrive in the digital age. As we
      continue to expand our presence, we are seeking passionate and dynamic
      individuals or organizations to join us in our journey as
      <strong>${programName}</strong> Partner.
    </p>
    <p>
      If you are passionate about technology, have a strong entrepreneurial
      spirit, and are ready to take your business to new heights, we invite you
      to explore this exciting opportunity with Deepnap Softech.
    </p>
    <p>
      Thank you for considering Deepnap Softech as your partner in success. We
      look forward to the possibility of working together to bring innovative
      technology solutions to businesses around the world.
    </p>
    <br />
    <p>
      <strong>Best regards</strong>,<br />
      ${agentName} <br />
      Deepnap Softech <br />
      +91 7042707091, +91 7042707092
    </p>
    <a href="http://www.deepnapsoftech.com" target="_blank" rel="noopener noreferrer">www.deepnapsoftech.com</a>
    `;
  return html;
};
const verifyProgarm = (name, password) => {
  return `
  <p
  style="
    color: #666;
    font-family: Arial, sans-serif;
    font-size: 16px;
    line-height: 1.5;
    margin-bottom: 8px;
  "
>
  Hi there ${name},
</p>
<p
  style="
    color: #666;
    font-family: Arial, sans-serif;
    font-size: 16px;
    line-height: 1.5;
    margin-bottom: 16px;
  "
>
  We received a request to that you are interseted in our franchise program ,
  and Your Mail is Verified Successfully.
  <br />Use the password given Below to access Deepnap Softech DashBoard.
</p>

<p
  style="
    color: #666;
    font-family: Arial, sans-serif;
    font-size: 16px;
    font-weight: bold;
    line-height: 1.5;
    margin-bottom: 16px;
  "
>
  Password : <span style="font-size: large; color: #000">${password}</span>
</p>
<p style="margin-bottom: 16px; font-size: 16px; color: #666">
  Click this link
  <a href="https://www.deepnapsoftech.com/login" style="text-decoration: none"
    >https://www.deepnapsoftech.com/login</a
  >
  to access Deepnap Softech
</p>

<p
  style="
    color: #666;
    font-family: Arial, sans-serif;
    font-size: 16px;
    line-height: 1.5;
  "
>
  Thank you,
</p>
<p
  style="
    color: #666;
    font-family: Arial, sans-serif;
    font-size: 16px;
    line-height: 1.5;
    margin-bottom: 0;
  "
>
  Deepnap Softech Team
</p>`;
};
const verifyAlreadyProgarm = (name, email) => {
  return `
  <p
  style="
    color: #666;
    font-family: Arial, sans-serif;
    font-size: 16px;
    line-height: 1.5;
    margin-bottom: 8px;
  "
>
  Hi there ${name},
</p>
<p
  style="
    color: #666;
    font-family: Arial, sans-serif;
    font-size: 16px;
    line-height: 1.5;
    margin-bottom: 16px;
  "
>
  We received a request to that you are interseted in our franchise program ,
  and Your Mail is Verified Successfully.
  <br />You are already register with Deepnap Softech you can use our email and password to access Deepnap Softech DashBoard.
</p>

<p
  style="
    color: #666;
    font-family: Arial, sans-serif;
    font-size: 16px;
    font-weight: bold;
    line-height: 1.5;
    margin-bottom: 16px;
  "
>
  Registered Email: <span style="font-size: large; color: #000">${email}</span>
</p>
<p style="margin-bottom: 16px; font-size: 16px; color: #666">
  Click this link
  <a href="https://www.deepnapsoftech.com/login" style="text-decoration: none"
    >https://www.deepnapsoftech.com/login</a
  >
  to access Deepnap Softech
</p>

<p
  style="
    color: #666;
    font-family: Arial, sans-serif;
    font-size: 16px;
    line-height: 1.5;
  "
>
  Thank you,
</p>
<p
  style="
    color: #666;
    font-family: Arial, sans-serif;
    font-size: 16px;
    line-height: 1.5;
    margin-bottom: 0;
  "
>
  Deepnap Softech Team
</p>`;
};
module.exports = {
  prgJoinTemp,
  verifyProgarm,
  verifyAlreadyProgarm,
};
