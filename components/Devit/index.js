import useTimeAgo from "../../hooks/useTimeAgo";
import Avatar from "../Avatar";
import useDateTimeFormat from "../../hooks/useDateTimeFormat";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Devit({
  avatar,
  img,
  userName,
  content,
  id,
  createdAt,
}) {
  const timeago = useTimeAgo(createdAt);
  const createdAtFormated = useDateTimeFormat(createdAt);
  const router = useRouter();

  const handleArticleClick = (e) => {
    e.preventDefault();
    router.push(`/status/${id}`);
  };

  return (
    <>
      <article onClick={handleArticleClick}>
        <div>
          <Avatar alt={userName} src={avatar} />
        </div>
        <section>
          <header>
            <strong>{userName}</strong>
            <span> . </span>
            <Link href={`/status/${id}`}>
              <a>
                <time title={createdAtFormated}>{timeago}</time>
              </a>
            </Link>
          </header>
          <p>{content}</p>
          {img && <img src={img} />}
        </section>
      </article>
      <style jsx>{`
        article {
          border-bottom: 2px solid #eee;
          display: flex;
          padding: 10px 15px;
        }
        article:hover {
          background: #f5f8fa;
          cursor: pointer;
        }
        img {
          border-radius: 10px;
          height: auto;
          width: 100%;
          margin-top: 10px;
        }
        div {
          padding-right: 10px;
        }
        p {
          line-height: 1.3125;
          margin: 0;
        }
        a {
          color: #555;
          font-size: 14px;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
      `}</style>
    </>
  );
}
