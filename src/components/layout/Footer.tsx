
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-primary rounded-lg w-8 h-8 flex items-center justify-center text-white font-bold">S</div>
              <span className="text-xl font-bold gradient-text">ShumerPrompt</span>
            </Link>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
              发现、创建和分享高质量的 AI 提示词，提升您的 AI 使用效率。
            </p>
          </div>
          
          {/* Links */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">探索</h3>
            <ul className="space-y-2">
              <li><Link to="/prompts" className="text-sm text-slate-600 dark:text-slate-400 hover:text-shumer-purple dark:hover:text-shumer-purple">浏览提示词</Link></li>
              <li><Link to="/categories" className="text-sm text-slate-600 dark:text-slate-400 hover:text-shumer-purple dark:hover:text-shumer-purple">分类</Link></li>
              <li><Link to="/popular" className="text-sm text-slate-600 dark:text-slate-400 hover:text-shumer-purple dark:hover:text-shumer-purple">热门提示词</Link></li>
              <li><Link to="/recent" className="text-sm text-slate-600 dark:text-slate-400 hover:text-shumer-purple dark:hover:text-shumer-purple">最新提示词</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">关于</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-slate-600 dark:text-slate-400 hover:text-shumer-purple dark:hover:text-shumer-purple">关于我们</Link></li>
              <li><Link to="/contact" className="text-sm text-slate-600 dark:text-slate-400 hover:text-shumer-purple dark:hover:text-shumer-purple">联系我们</Link></li>
              <li><Link to="/faq" className="text-sm text-slate-600 dark:text-slate-400 hover:text-shumer-purple dark:hover:text-shumer-purple">常见问题</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">法律</h3>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-sm text-slate-600 dark:text-slate-400 hover:text-shumer-purple dark:hover:text-shumer-purple">服务条款</Link></li>
              <li><Link to="/privacy" className="text-sm text-slate-600 dark:text-slate-400 hover:text-shumer-purple dark:hover:text-shumer-purple">隐私政策</Link></li>
              <li><Link to="/cookies" className="text-sm text-slate-600 dark:text-slate-400 hover:text-shumer-purple dark:hover:text-shumer-purple">Cookie 政策</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-200 dark:border-slate-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} ShumerPrompt. 保留所有权利。
          </p>
          <div className="flex mt-4 md:mt-0 space-x-6">
            <a href="#" className="text-slate-500 hover:text-shumer-purple">
              <span className="sr-only">Twitter</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" className="text-slate-500 hover:text-shumer-purple">
              <span className="sr-only">GitHub</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
