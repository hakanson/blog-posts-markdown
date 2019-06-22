---
title: Creating and Using an AWS Virtual MFA Device with the AWS SDK for Python
slug: creating-and-using-an-aws-virtual-mfa-device-with-the-aws-sdk-for-python
author: Kevin Hakanson
date: 2017-10-21
tags: ["aws","python","aws sdk","aws iam","information security"]
---
Some scenarios, like on-premise servers that need access to AWS resources, require AWS IAM Users to be created.  These "service users" are given Access Keys, which serve as long term credentials and needed to be protected.  An additional measure of protection could be to enable programmatic multifactor authentication for these users.

This Python code creates a virtual MFA device with [Boto 3](http://boto3.readthedocs.io/en/latest/index.html) (AWS SDK for Python).  The  [`create_virtual_mfa_device`](https://boto3.readthedocs.io/en/latest/reference/services/iam.html#IAM.Client.create_virtual_mfa_device) response includes a shared secret (saved in `string_seed`) and the bytes of a PNG image of a QR code that can be used with standard Authenticator apps.

```python
session = boto3.session.Session(profile_name='kjh-SuperDuperUser')
iam_client = session.client('iam')

response = iam_client.create_virtual_mfa_device(
    Path='/service-user/',
    VirtualMFADeviceName='kjh-SuperDuperUser'
)

string_seed = response['VirtualMFADevice']['Base32StringSeed']

qrbytes = response['VirtualMFADevice']['QRCodePNG']
with open('kjh-SuperDuperUser.png', mode='wb') as f:
    f.write(qrbytes)
    f.close()
```

Using [GitHub - pyotp/pyotp: Python One-Time Password Library](https://github.com/pyotp/pyotp), two consecutive codes are generated from the `string_seed` to enable the virtual mfa device for the user.

```python
totp = pyotp.TOTP(string_seed)

# the code from 30 seconds ago
code_1 = totp.generate_otp(totp.timecode(datetime.datetime.now() - datetime.timedelta(seconds=30)))
# the current code
code_2 = totp.generate_otp(totp.timecode(datetime.datetime.now()))

response = iam_client.enable_mfa_device(
    UserName='kjh-SuperDuperUser',
    SerialNumber='arn:aws:iam::123456789012:mfa/service-user/kjh-SuperDuperUser',
    AuthenticationCode1=code_1,
    AuthenticationCode2=code_2
)
```

Afterwards, looking at the AWS Console indicates `kjh-SuperDuperUser` now has an assigned MFA device.  Additionally, `kjh-DuperRole` has this Trust Policy, which requires MFA to be present for `sts:AssumeRole`.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::123456789012:user/service-user/kjh-SuperDuperUser"
      },
      "Action": "sts:AssumeRole",
      "Condition": {
        "Bool": {
          "aws:MultiFactorAuthPresent": "true"
        }
      }
    }
  ]
}
```

To use the Virtual MFA Device in an [`assume_role`](http://boto3.readthedocs.io/en/latest/reference/services/sts.html#STS.Client.assume_role) API call, a TOTP code needs to be generated and passed as a parameter.

```python
sts_client = session.client('sts')

totp = pyotp.TOTP(string_seed)
token_code = totp.now()

response = sts_client.assume_role(
    RoleArn='arn:aws:iam::123456789012:role/kjh-DuperRole',
    RoleSessionName='my-python-session',
    SerialNumber='arn:aws:iam::123456789012:mfa/service-user/kjh-SuperDuperUser',
    TokenCode=token_code
)
```

Note:  This IAM Policy needed to be added to `kjh-SuperDuperUser` in order to allow the MFA related actions.

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "iam:CreateVirtualMFADevice",
                "iam:DeleteVirtualMFADevice"
            ],
            "Resource": [
                "arn:aws:iam::123456789012:mfa/service-user/${aws:username}"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "iam:EnableMFADevice",
                "iam:DeactivateMFADevice",
                "iam:ResyncMFADevice"
            ],
            "Resource": [
                "arn:aws:iam::123456789012:user/service-user/${aws:username}"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "iam:ListVirtualMFADevices"
            ],
            "Resource": [
                "arn:aws:iam::123456789012:mfa/*"
            ]
        }
    ]
}
```

References:

* [Enabling a Virtual Multi-factor Authentication (MFA) Device - AWS Identity and Access Management](http://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_mfa_enable_virtual.html)
* [Enable and manage virtual MFA devices (AWS CLI, Tools for Windows PowerShell, or AWS API) - AWS Identity and Access Management](http://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_mfa_enable_cliapi.html)
* [Configuring MFA-Protected API Access - AWS Identity and Access Management](http://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_mfa_configure-api-require.html)
