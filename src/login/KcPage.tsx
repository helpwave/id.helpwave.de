import { Suspense } from "react";
import type { KcContext } from "./KcContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

export default function KcPage(props: { kcContext: KcContext }) {
    const { kcContext } = props;

    return (
        <Suspense>
            {(() => {
                switch (kcContext.pageId) {
                    case "login.ftl":
                        return <Login kcContext={kcContext} />;
                    case "register.ftl":
                        return <Register kcContext={kcContext} />;
                    case "login-reset-password.ftl":
                        return <ForgotPassword kcContext={kcContext} />;
                    default:
                        return (
                            <div>
                                <p>Page not implemented: {kcContext.pageId}</p>
                            </div>
                        );
                }
            })()}
        </Suspense>
    );
}
