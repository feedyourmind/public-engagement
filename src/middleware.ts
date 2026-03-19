import { NextRequest, NextResponse } from "next/server";
import { getViewByDomain, getViewBySlug } from "@/config/views";

export function middleware(request: NextRequest) {
  const hostname = (request.headers.get("host") ?? "").replace(/:\d+$/, "");
  const view = getViewByDomain(hostname);

  let viewSlug: string | undefined;
  if (view) {
    viewSlug = view.slug;
  } else {
    const envView = process.env.NEXT_PUBLIC_VIEW;
    if (envView && getViewBySlug(envView)) {
      viewSlug = envView;
    }
  }

  if (viewSlug) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-view-slug", viewSlug);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
