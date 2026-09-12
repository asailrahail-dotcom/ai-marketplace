import { getHomepageContent } from '@/lib/content';
import { updateHomepageContent } from '@/app/actions/admin';

export default async function AdminContentPage() {
  const content = await getHomepageContent();

  return (
    <div className="max-w-2xl">
      <h1 className="h2 mb-2">إدارة المحتوى</h1>
      <p className="text-muted mb-8">تحكّم في نصوص الصفحة الرئيسية دون الحاجة لتعديل الكود.</p>

      <form action={updateHomepageContent} className="card p-6 space-y-4">
        <div>
          <label className="text-sm font-medium block mb-1.5">عنوان مشروع AI</label>
          <input name="heroTitle" defaultValue={content.heroTitle} className="input" />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1.5">وصف مشروع AI</label>
          <textarea name="heroSubtitle" defaultValue={content.heroSubtitle} rows={2} className="input" />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1.5">عنوان قسم الاكتشاف</label>
          <input name="discoverTitle" defaultValue={content.discoverTitle} className="input" />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1.5">وصف قسم الاكتشاف</label>
          <textarea name="discoverSubtitle" defaultValue={content.discoverSubtitle} rows={2} className="input" />
        </div>
        <button type="submit" className="btn btn-primary">حفظ التغييرات</button>
      </form>
    </div>
  );
}
