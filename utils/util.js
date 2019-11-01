/**
 * 防止多次重复点击打开多个页面
 */

function buttonClicked(self) {
  self.setData({
    buttonClicked: true
  })
  setTimeout(function () {
    self.setData({
      buttonClicked: false
    })
  }, 500)
}

/**
 * 验证身份证
 */
function IdCardValidate(idCard) {
  const idCards = trim(idCard.replace(/ /g, ''));
  if (idCard.length === 15) {
    return isValidityBrithBy15IdCard(idCards);
  } else if (idCards.length === 18) {
    const idCardS = idCards.split(''); // 得到身份证数组
    if (isValidityBrithBy18IdCard(idCards) && isTrueValidateCodeBy18IdCard(idCardS)) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }

  function isTrueValidateCodeBy18IdCard(aIdCard) {
    const Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1];
    const ValideCode = ['1', '0', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
    let sum = 0;
    const AidCard = aIdCard;
    if (AidCard[17].toLowerCase() === 'x') {
      AidCard[17] = '10';
    }
    for (let i = 0; i < 17; i += 1) {
      sum += Wi[i] * AidCard[i];
    }
    const valCodePosition = sum % 11;
    if (AidCard[17] === ValideCode[valCodePosition]) {
      return true;
    } else {
      return false;
    }
  }

  function isValidityBrithBy18IdCard(idCard18) {
    const year = idCard18.substring(6, 10);
    const month = idCard18.substring(10, 12);
    const day = idCard18.substring(12, 14);
    const tempDate = new Date(year, parseFloat(month) - 1, parseFloat(day));
    // 这里用getFullYear()获取年份，避免千年虫问题
    if (tempDate.getFullYear()
      !== parseFloat(year)
      || tempDate.getMonth()
      !== parseFloat(month) - 1
      || tempDate.getDate()
      !== parseFloat(day)) {
      return false;
    } else {
      return true;
    }
  }

  function isValidityBrithBy15IdCard(idCard15) {
    const year = idCard15.substring(6, 8);
    const month = idCard15.substring(8, 10);
    const day = idCard15.substring(10, 12);
    const tempDate = new Date(year, parseFloat(month) - 1, parseFloat(day));
    if (tempDate.getYear()
      !== parseFloat(year) ||
      tempDate.getMonth()
      !== parseFloat(month) - 1 || tempDate.getDate() !== parseFloat(day)) {
      return false;
    } else {
      return true;
    }
  }
  function trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, '');
  }
}
/**
 * 验证银行账号
 */
function bankCardValidate(bankno) {
  const lastNum = +bankno.substr(bankno.length - 1, 1);
  const first15Num = bankno.substr(0, bankno.length - 1);
  const newArr = [];
  for (let i = first15Num.length - 1; i > -1; i -= 1) {
    newArr.push(first15Num.substr(i, 1));
  }
  const arrJiShu = [];
  const arrJiShu2 = [];
  const arrOuShu = [];
  for (let j = 0; j < newArr.length; j += 1) {
    if ((j + 1) % 2 === 1) {
      if (parseInt(newArr[j], 10) * 2 < 9) {
        arrJiShu.push(parseInt(newArr[j], 10) * 2);
      } else {
        arrJiShu2.push(parseInt(newArr[j], 10) * 2);
      }
    } else {
      arrOuShu.push(newArr[j]);
    }
  }

  const jishuChild1 = [];
  const jishuChild2 = [];
  for (let h = 0; h < arrJiShu2.length; h += 1) {
    jishuChild1.push(parseInt(arrJiShu2[h], 10) % 10);
    jishuChild2.push(parseInt(arrJiShu2[h], 10) / 10);
  }

  let sumJiShu = 0;
  let sumOuShu = 0;
  let sumJiShuChild1 = 0;
  let sumJiShuChild2 = 0;
  let sumTotal = 0;
  for (let m = 0; m < arrJiShu.length; m += 1) {
    sumJiShu += parseInt(arrJiShu[m], 10);
  }

  for (let n = 0; n < arrOuShu.length; n += 1) {
    sumOuShu += parseInt(arrOuShu[n], 10);
  }

  for (let p = 0; p < jishuChild1.length; p += 1) {
    sumJiShuChild1 += parseInt(jishuChild1[p], 10);
    sumJiShuChild2 += parseInt(jishuChild2[p], 10);
  }
  sumTotal = parseInt(sumJiShu, 10) + parseInt(sumOuShu, 10)
    + parseInt(sumJiShuChild1, 10) + parseInt(sumJiShuChild2, 10);
  const k = parseInt(sumTotal, 10) % 10 === 0 ? 10 : parseInt(sumTotal, 10) % 10;
  const luhn = 10 - k;
  if (lastNum === luhn) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  buttonClicked: buttonClicked,
  bankCardValidate: bankCardValidate,
  IdCardValidate: IdCardValidate
}