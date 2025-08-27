import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import routes from '../routes';
import ScrollToTop from '../view/component/ScrollToTop';
import Loader from '../view/component/Loader';

function Content() {
    return (
        <div>
            <Suspense
                fallback={
                    <div className="flex justify-center h-screen">
                        <Loader />
                    </div>
                }
            >
                <ScrollToTop />
                <Routes>
                    {routes?.map((route, idx) => {
                        return (
                            route.element && (
                                <Route
                                    key={idx}
                                    path={route.path}
                                    exact={route.exact}
                                    name={route.name}
                                    element={<route.element />}
                                />
                            )
                        );
                    })}
                    <Route path="/" element={<Navigate to="/" replace />} />
                </Routes>
            </Suspense>
        </div>
    )
}

export default Content