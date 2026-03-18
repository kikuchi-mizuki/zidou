const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Wait helper function
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const screenshots = [
  {
    name: '01-dashboard.png',
    url: 'http://localhost:3000/',
    description: 'ダッシュボード',
    waitFor: 1000,
  },
  {
    name: '02-products.png',
    url: 'http://localhost:3000/products',
    description: '商品管理',
    waitFor: 1000,
  },
  {
    name: '03-inventory-list.png',
    url: 'http://localhost:3000/inventory',
    description: '在庫管理（一覧）',
    waitFor: 1000,
  },
  {
    name: '04-inventory-add.png',
    url: 'http://localhost:3000/inventory',
    description: '在庫追加フォーム',
    waitFor: 1000,
    clickSelector: 'button:has-text("在庫追加")',
    customAction: async (page) => {
      // 在庫追加ボタンをクリック
      await page.click('button:has(svg)');
      await wait(500);
    },
  },
  {
    name: '05-orders-list.png',
    url: 'http://localhost:3000/orders',
    description: '発注管理（一覧）',
    waitFor: 1000,
  },
  {
    name: '06-orders-add.png',
    url: 'http://localhost:3000/orders',
    description: '新規発注フォーム',
    waitFor: 1000,
    customAction: async (page) => {
      // 新規発注ボタンをクリック
      const buttons = await page.$$('button');
      for (const button of buttons) {
        const text = await page.evaluate(el => el.textContent, button);
        if (text.includes('新規発注')) {
          await button.click();
          await wait(500);
          break;
        }
      }
    },
  },
  {
    name: '07-rules.png',
    url: 'http://localhost:3000/rules',
    description: 'ルール管理',
    waitFor: 1000,
  },
  {
    name: '08-calculate-before.png',
    url: 'http://localhost:3000/calculate',
    description: '自動計算（実行前）',
    waitFor: 1000,
  },
  {
    name: '09-calculate-after.png',
    url: 'http://localhost:3000/calculate',
    description: '自動計算（実行後）',
    waitFor: 1000,
    customAction: async (page) => {
      // 自動計算を実行ボタンをクリック
      const buttons = await page.$$('button');
      for (const button of buttons) {
        const text = await page.evaluate(el => el.textContent, button);
        if (text.includes('自動計算を実行')) {
          await button.click();
          // ログが表示されるまで待つ
          await wait(3000);
          break;
        }
      }
    },
  },
  {
    name: '10-delivery-plan.png',
    url: 'http://localhost:3000/delivery-plan',
    description: '納品計画',
    waitFor: 1000,
  },
];

async function takeScreenshots() {
  console.log('🚀 スクリーンショット撮影を開始します...\n');

  // 出力ディレクトリを作成
  const outputDir = path.join(__dirname, '../docs/screenshots');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  for (const screenshot of screenshots) {
    try {
      console.log(`📸 撮影中: ${screenshot.description} (${screenshot.name})`);

      // ページにアクセス
      await page.goto(screenshot.url, {
        waitUntil: 'networkidle0',
        timeout: 10000
      });

      // 待機
      await wait(screenshot.waitFor);

      // カスタムアクション（ボタンクリックなど）
      if (screenshot.customAction) {
        await screenshot.customAction(page);
      }

      // スクリーンショット撮影
      const outputPath = path.join(outputDir, screenshot.name);
      await page.screenshot({
        path: outputPath,
        fullPage: true,
      });

      console.log(`✅ 保存完了: ${outputPath}\n`);
    } catch (error) {
      console.error(`❌ エラー: ${screenshot.description}`, error.message, '\n');
    }
  }

  await browser.close();
  console.log('🎉 すべてのスクリーンショット撮影が完了しました！');
}

// スクリプト実行
takeScreenshots().catch(error => {
  console.error('エラーが発生しました:', error);
  process.exit(1);
});
