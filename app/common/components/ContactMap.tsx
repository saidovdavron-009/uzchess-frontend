"use client"
import {useEffect, useRef} from "react";
import Image from "next/image";

const CENTER: [number, number] = [41.2995, 69.2401];
const ZOOM = 14;

export default function ContactMap() {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        let cancelled = false;

        (async () => {
            const L = (await import("leaflet")).default;
            await import("leaflet/dist/leaflet.css");

            if (cancelled || !containerRef.current) return;

            const container = containerRef.current as any;
            if (container._leaflet_id) {
                delete container._leaflet_id;
            }

            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
                shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            });

            const map = L.map(containerRef.current, {
                center: CENTER,
                zoom: ZOOM,
                zoomControl: false,
                scrollWheelZoom: false,
                attributionControl: false,
            });

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
            L.marker(CENTER).addTo(map);

            if (!cancelled) mapRef.current = map;
        })();

        return () => {
            cancelled = true;
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    return (
        <div className="relative w-[1026px] h-[300px] rounded-[12px] overflow-hidden border-2 border-white">
            <div ref={containerRef} className="w-full h-full"/>

            <div className="absolute z-[1000] right-[12px] top-[164px] w-[32px] h-[124px]">
                <button
                    onClick={() => mapRef.current?.zoomIn()}
                    className="absolute top-0 w-[32px] h-[32px] bg-[#1A1D1F] border border-[#1F272A] rounded-[8px] flex items-center justify-center">
                    <Image src="/map-zoom-in.svg" alt="+" width={20} height={20}/>
                </button>
                <button
                    onClick={() => mapRef.current?.zoomOut()}
                    className="absolute top-[40px] w-[32px] h-[32px] bg-[#1A1D1F] border border-[#1F272A] rounded-[8px] flex items-center justify-center">
                    <Image src="/map-zoom-out.svg" alt="-" width={20} height={20}/>
                </button>
                <button
                    onClick={() => {
                        navigator.geolocation?.getCurrentPosition(({coords}) => {
                            mapRef.current?.setView([coords.latitude, coords.longitude], 15);
                        });
                    }}
                    className="absolute top-[92px] w-[32px] h-[32px] bg-[#1A1D1F] border border-[#1F272A] rounded-[8px] flex items-center justify-center">
                    <Image src="/map-current-location.svg" alt="location" width={20} height={20}/>
                </button>
            </div>

            <a
                href="https://www.google.com/maps?q=41.2995,69.2401"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-[12px] left-[12px] w-[155px] h-[32px] flex items-center gap-[6px] bg-[#1C91E0] border border-white rounded-[6px] px-[10px] hover:bg-[#177db3] transition-colors z-[1000]">
                <Image src="/map-location-btn-icon.svg" alt="" width={16} height={16}/>
                <span className="text-white text-[14px] font-medium font-poppins whitespace-nowrap">Qanday borish?</span>
            </a>
        </div>
    );
}
