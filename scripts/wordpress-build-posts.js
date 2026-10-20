/** Build-only WordPress post discovery; never turn API failures into empty lists. */
const ENDPOINT = 'https://creativosespacios.mx/blog-admin/index.php';
const PER_PAGE = 100;

export async function fetchWordPressPage(page, fetchImpl = fetch) {
  const url = `${ENDPOINT}?rest_route=/wp/v2/posts&per_page=${PER_PAGE}&page=${page}&status=publish`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetchImpl(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; CE-Build/1.0)', Accept: 'application/json' }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const totalHeader = response.headers.get('x-wp-total');
    const pagesHeader = response.headers.get('x-wp-totalpages');
    if (totalHeader === null || pagesHeader === null) throw new Error('Missing WordPress pagination headers');
    if (!/^\d+$/.test(totalHeader) || !/^\d+$/.test(pagesHeader)) {
      throw new Error('Invalid WordPress pagination headers');
    }
    const posts = await response.json();
    return {
      posts,
      total: Number(totalHeader),
      totalPages: Number(pagesHeader)
    };
  } catch (error) {
    throw new Error(`WordPress page ${page}: ${error.message}`, { cause: error });
  } finally {
    clearTimeout(timer);
  }
}

export async function getPublishedPosts(fetchPage = fetchWordPressPage) {
  const first = await fetchPage(1);
  const { total, totalPages } = first;
  if (!Number.isInteger(total) || total < 0 || !Number.isInteger(totalPages) || totalPages < 0) {
    throw new Error('WordPress returned invalid pagination headers');
  }
  if (!Array.isArray(first.posts)) throw new Error('WordPress returned a non-array posts payload (page 1)');
  if (total === 0 && totalPages === 0 && first.posts.length === 0) return [];
  if (total === 0 || totalPages === 0 || totalPages !== Math.ceil(total / PER_PAGE)) {
    throw new Error('WordPress pagination totals are inconsistent');
  }

  const posts = [...first.posts];
  for (let page = 2; page <= totalPages; page++) {
    const result = await fetchPage(page);
    if (result.total !== total || result.totalPages !== totalPages || !Array.isArray(result.posts)) {
      throw new Error(`WordPress pagination changed or returned invalid data on page ${page}`);
    }
    posts.push(...result.posts);
  }
  if (posts.length !== total) {
    throw new Error(`WordPress post count mismatch: expected ${total}, fetched ${posts.length}`);
  }
  const seen = new Set();
  return posts.map((post) => {
    if (!post || typeof post.slug !== 'string' || !post.slug ||
        /[\\/?#\s]/.test(post.slug) || /^\.+$/.test(post.slug) ||
        typeof post.modified !== 'string' || !/^\d{4}-\d{2}-\d{2}T/.test(post.modified)) {
      throw new Error('WordPress returned an invalid post slug or modification date');
    }
    if (seen.has(post.slug)) throw new Error(`Duplicate WordPress slug: ${post.slug}`);
    seen.add(post.slug);
    return { slug: post.slug, modified: post.modified };
  });
}
