import { createComment, createPost } from "./actions";
import { prisma } from "@/lib/prisma";
import { connection } from "next/server";
import Link from "next/link";
import styles from "./page.module.css";

export default async function PostsPage() {
  await connection();
  const posts = await prisma.post.findMany({
    include: { author: true, comments: { include: { author: true } } } as const,
    orderBy: { id: "desc" },
  });
  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <Link
          className={styles.brand}
          href='/'
          aria-label='Ruang Tulis, beranda'>
          <span className={styles.brandMark}>R</span>
          <span>
            ruang<span className={styles.brandAccent}>tulis</span>
          </span>
        </Link>
        <span className={styles.topbarNote}>CATATAN KOMUNITAS</span>
      </header>

      <div className={styles.content}>
        <section className={styles.intro}>
          <div>
            <p className={styles.eyebrow}>CERITA TERBARU</p>
            <h1>Catatan &amp; cerita.</h1>
            <p className={styles.introCopy}>
              Tempat berbagi hal yang layak dibaca.
            </p>
          </div>
          <span className={styles.postCount}>
            <strong>{posts.length.toString().padStart(2, "0")}</strong>
            <span>tulisan</span>
          </span>
        </section>

        <section className={styles.composer} aria-labelledby='compose-title'>
          <div className={styles.sectionHeading}>
            <span className={styles.sectionIndex}>01</span>
            <h2 id='compose-title'>Tulis sesuatu</h2>
          </div>
          <form action={createPost} className={styles.form}>
            <label className={styles.field}>
              <span>Email penulis</span>
              <input
                name='authorEmail'
                type='email'
                placeholder='nama@contoh.com'
                required
              />
            </label>
            <label className={styles.field}>
              <span>Judul tulisan</span>
              <input
                name='title'
                placeholder='Beri cerita ini judul'
                required
              />
            </label>
            <label className={`${styles.field} ${styles.fullWidth}`}>
              <span>Isi tulisan</span>
              <textarea
                name='content'
                rows={4}
                placeholder='Mulai menulis...'
                required
              />
            </label>
            <div className={styles.formFooter}>
              <span className={styles.formHint}>
                Tulisan akan langsung terbit.
              </span>
              <button className={styles.submitButton} type='submit'>
                Terbitkan tulisan <span aria-hidden='true'>↗</span>
              </button>
            </div>
          </form>
        </section>

        <section className={styles.feed} aria-labelledby='feed-title'>
          <div className={styles.feedHeading}>
            <h2 id='feed-title'>Tulisan terbaru</h2>
            <span>URUTAN TERBARU</span>
          </div>
          {posts.length === 0 ? (
            <p className={styles.emptyState}>
              Belum ada tulisan. Mulai dengan cerita pertama.
            </p>
          ) : (
            <div className={styles.postList}>
              {posts.map((post) => (
                <article className={styles.post} key={post.id}>
                  <span className={styles.avatar} aria-hidden='true'>
                    {post.author.name.slice(0, 1).toUpperCase()}
                  </span>
                  <div className={styles.postContent}>
                    <h3>{post.title}</h3>
                    <p className={styles.postBody}>{post.content}</p>
                    <p className={styles.postMeta}>
                      <span>Oleh {post.author.name}</span>
                      <span>{post.comments.length} komentar</span>
                    </p>
                    <div className={styles.commentSection}>
                      {post.comments.length > 0 && (
                        <ul className={styles.commentList}>
                          {post.comments.map((comment) => (
                            <li className={styles.comment} key={comment.id}>
                              <span className={styles.commentAuthor}>
                                {comment.author.name}
                              </span>
                              <p className={styles.commentBody}>{comment.body}</p>
                            </li>
                          ))}
                        </ul>
                      )}
                      <form action={createComment} className={styles.commentForm}>
                        <input type="hidden" name="postId" value={post.id} />
                        <label className={styles.commentField}>
                          <span>Tulis komentar</span>
                          <textarea
                            name="body"
                            rows={2}
                            placeholder="Bagikan tanggapanmu..."
                            required
                          />
                        </label>
                        <div className={styles.commentFooter}>
                          <label className={styles.commentEmail}>
                            <span>Email</span>
                            <input
                              name="authorEmail"
                              type="email"
                              placeholder="nama@contoh.com"
                              required
                            />
                          </label>
                          <button className={styles.submitButton} type="submit">
                            Kirim komentar
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
