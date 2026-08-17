async function handleEmailSubmit() {
  const emailInput = document.getElementById('user-email');
  const email = emailInput.value.trim();

  if (email && email.includes('@')) {
    // 1. 触发 GA4 统计
    gtag('event', 'submit_email', {
      'node_id': 'palo_alto_coupa_04',
      'user_email': email
    });

    // 按钮变成 sending 状态
    const btn = event.target;
    btn.innerText = 'Sending...';
    btn.disabled = true;

    try {
      // 2. 发送真实邮件（通过 Web3Forms 接口）
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // ⚠️ 请去 web3forms.com 免费输入你的邮箱获取 access_key 并填在下方：
          access_key: 'YOUR_WEB3FORMS_ACCESS_KEY', 
          subject: '⚡ New RayNode VIP Lead from Palo Alto Pilot!',
          from_name: 'RayNode Solar Charge',
          email: email,
          message: `User ${email} tap-to-paid $3.00 at Coupa Cafe and claimed $10 coupon!`
        })
      });

      if (response.ok) {
        // UI 显示成功
        document.getElementById('email-form-container').classList.add('hidden');
        document.getElementById('email-success').classList.remove('hidden');

        setTimeout(() => {
          document.getElementById('beta-modal').classList.add('hidden');
        }, 3000);
      }
    } catch (error) {
      console.error('Email send failed', error);
      // 备用成功提示，不卡住用户体验
      document.getElementById('email-form-container').classList.add('hidden');
      document.getElementById('email-success').classList.remove('hidden');
    }
  } else {
    emailInput.classList.add('border-red-500');
  }
}