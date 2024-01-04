export function generateRandomChineseName() {
  const familyNames = '赵钱孙李周吴郑王';
  const givenNames = '伟芳娜秀英敏静亮强磊冰洋勇艳娟涛春花飞跃平刚桂英';

  const randomFamilyName =
    familyNames[Math.floor(Math.random() * familyNames.length)];
  const randomGivenName1 =
    givenNames[Math.floor(Math.random() * givenNames.length)];
  const randomGivenName2 =
    givenNames[Math.floor(Math.random() * givenNames.length)];

  return randomFamilyName! + randomGivenName1! + randomGivenName2;
}

export function generateRandomChineseNames(n: number) {
  const names = [];
  for (let i = 0; i < n; i++) {
    names.push(generateRandomChineseName());
  }
  return names;
}
