import { exec } from 'child_process';
import * as fs from 'fs';
import path from 'path';
import { DartGeneratorSettings } from '../dart_settings.interface';

export class EndpointGenerator {
    private dart_routes_stub = `
    import 'package:abcx3/gen_models/abcx3_stores_library.dart';

    enum Abc3Route implements Endpoint {
        #{Routes}
        
        const Abc3Route(this.path, this.method);
      
        @override
        final String path;
        
        @override
        final HttpMethod method;

        static String withPathParameter(String path, dynamic param) {
            final regex = RegExp(r':([a-zA-Z]+)\\??');
            if (param == null) {
            // Remove the path parameter entirely if param is null
            return path.replaceFirst(regex, '');
            } else {
            // Replace the path parameter with the param value
            return path.replaceFirst(regex, param.toString());
            }
        }
      }`;

    generateDartRoutesCode = (routes: Array<{url: string, method: string}>) => {
        const routeStub = `#{RouteName}("#{RoutePath}", #{RouteMethod}),\n`
        let allRoutesCode = '';
        routes.forEach(route => {
            if (route.method !== 'HEAD') {
                let routeCode = routeStub;
                let routeName = this.generateRouteName(route.url, route.method);
                routeCode = routeCode.replace("#{RouteName}", routeName);
                routeCode = routeCode.replace("#{RoutePath}", route.url);
                routeCode = routeCode.replace("#{RouteMethod}", `HttpMethod.${route.method.toLowerCase()}`);
                allRoutesCode += routeCode;
            }
        });
        allRoutesCode = allRoutesCode.substring(0, allRoutesCode.length - 2) + ';\n';
        const code = this.dart_routes_stub.replace("#{Routes}", allRoutesCode);
        return code;
    }

    private generateRouteName(url: string, method: string): string {
        // Remove leading slash and split by path segments
        let pathSegments = url.substring(1).split('/');
        
        // Handle root path
        if (pathSegments.length === 1 && pathSegments[0] === '') {
            return `root_${method.toLowerCase()}`;
        }
        
        // Handle wildcard
        if (pathSegments.length === 1 && pathSegments[0] === '*') {
            return `root_${method.toLowerCase()}`;
        }
        
        // Process each segment
        let routeName = '';
        for (let i = 0; i < pathSegments.length; i++) {
            let segment = pathSegments[i];
            
            // Handle path parameters (e.g., :id, :userId?)
            if (segment.startsWith(':')) {
                // Remove : and ? from parameter names
                segment = segment.replace(/^:/, '').replace(/\?$/, '');
                routeName += (routeName ? '_' : '') + '$' + segment;
            } else if (segment === '*') {
                routeName += (routeName ? '_' : '') + 'wildcard';
            } else if (segment !== '') {
                // Replace hyphens with underscores and add to route name
                segment = segment.replace(/-/g, '_');
                routeName += (routeName ? '_' : '') + segment;
            }
        }
        
        // Add method suffix
        routeName += '_' + method.toLowerCase();
        
        return routeName;
    }

    createDartRoutesFile = (routes: Array<{url: string, method: string}>, dartFilePath: string, settings: DartGeneratorSettings) => {
        const code = this.generateDartRoutesCode(routes);
        
        try {
            // Write file synchronously to ensure it's completed before the generator finishes
            fs.writeFileSync(dartFilePath, code, 'utf8');
            console.log("Dart routes file has been saved.");
            
            if (settings.FormatWithDart) {
                this.formatDartFile(dartFilePath);
            }
        } catch (err) {
            console.log("An error occurred while writing routes to Dart File:", err);
        }
    }

    formatDartFile = (outputPath: string) => {
        exec(`dart format "${outputPath}"`, (error, stdout, stderr) => {
            if (error) {
                console.log('dart format couldn\'t run. Make sure you have Dart installed properly by going to https://dart.dev/get-dart');
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
        });
    }

    /**
     * Scans the backend source code to extract route definitions
     * This method looks for NestJS route decorators and extracts the path and method information
     */
    extractRoutesFromBackend(backendPath: string): Array<{url: string, method: string}> {
        const routes: Array<{url: string, method: string}> = [];
        
        try {
            // Read all TypeScript files in both routes and gen directories
            const routesDir = backendPath; // path.join(backendPath, 'src') : './src';
            
            // Scan routes directory
            if (fs.existsSync(routesDir)) {
                const files = this.getAllTsFiles(routesDir);
                for (const file of files) {
                    const content = fs.readFileSync(file, 'utf8');
                    const fileRoutes = this.extractRoutesFromFile(content);
                    routes.push(...fileRoutes);
                }
                console.log(`Found ${routes.length} routes in src directory`);
            } else {
                console.log('Routes directory not found, skipping');
            }

            if (routes.length === 0) {
                console.log('No routes found, skipping endpoint generation');
                return routes;
            }
        } catch (error) {
            console.log('Error extracting routes from backend:', error);
        }

        // Remove duplicates based on url and method combination
        const uniqueRoutes = this.removeDuplicateRoutes(routes);
        console.log(`Removed ${routes.length - uniqueRoutes.length} duplicate routes`);
        
        return uniqueRoutes;
    }
    /* async extractRoutesFromBackend(backendPath: string): Promise<Array<{url: string, method: string}>> {
        const routes: Array<{url: string, method: string}> = [];
        
        try {
            // Read all TypeScript files in both routes and gen directories
            const routesDir = path.join(backendPath, 'src', 'routes');
            const genDir = path.join(backendPath, 'src', 'gen');
            
            // Scan routes directory
            if (fs.existsSync(routesDir)) {
                const files = this.getAllTsFiles(routesDir);
                for (const file of files) {
                    const content = fs.readFileSync(file, 'utf8');
                    const fileRoutes = this.extractRoutesFromFile(content);
                    routes.push(...fileRoutes);
                }
                console.log(`Found ${routes.length} routes in src/routes directory`);
            } else {
                console.log('Routes directory not found, skipping');
            }

            // Scan gen directory for auto-generated controllers
            if (fs.existsSync(genDir)) {
                const genFiles = this.getAllTsFiles(genDir);
                for (const file of genFiles) {
                    const content = fs.readFileSync(file, 'utf8');
                    const fileRoutes = this.extractRoutesFromFile(content);
                    routes.push(...fileRoutes);
                }
                console.log(`Found ${routes.length} total routes after scanning src/gen directory`);
            } else {
                console.log('Gen directory not found, skipping');
            }

            if (routes.length === 0) {
                console.log('No routes found in either directory, skipping endpoint generation');
                return routes;
            }
        } catch (error) {
            console.log('Error extracting routes from backend:', error);
        }

        // Remove duplicates based on url and method combination
        const uniqueRoutes = this.removeDuplicateRoutes(routes);
        console.log(`Removed ${routes.length - uniqueRoutes.length} duplicate routes`);
        
        return uniqueRoutes;
    } */

    private getAllTsFiles(dir: string): string[] {
        const files: string[] = [];
        
        const items = fs.readdirSync(dir);
        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                files.push(...this.getAllTsFiles(fullPath));
            } else if (item.endsWith('.ts') && !item.endsWith('.spec.ts')) {
                files.push(fullPath);
            }
        }
        
        return files;
    }

    private extractRoutesFromFile(content: string): Array<{url: string, method: string}> {
        const routes: Array<{url: string, method: string}> = [];
        
        // Extract controller prefix
        const controllerMatch = content.match(/@Controller\s*\(\s*['"`]([^'"`]*?)['"`]\s*\)/);
        const controllerPrefix = controllerMatch ? controllerMatch[1] : '';
        
        // Match @Get, @Post, @Put, @Delete, @Patch decorators with optional path
        // Supports: @Get('path'), @Get("path"), @Get(`path`), and @Get()
        const routeRegex = /@(Get|Post|Put|Delete|Patch|Options|Head)\s*\(\s*(?:['"`]([^'"`]*)['"`])?\s*\)/g;
        let match;
        
        while ((match = routeRegex.exec(content)) !== null) {
            const method = match[1].toUpperCase();
            let path = match[2] ?? '';
            
            // Handle empty path (root path)
            if (!path) {
                path = '/';
            }
            
            // Ensure path starts with /
            if (!path.startsWith('/')) {
                path = '/' + path;
            }
            
            // Prepend controller prefix if it exists
            if (controllerPrefix) {
                // Remove leading slash from controller prefix if it exists
                const cleanPrefix = controllerPrefix.startsWith('/') ? controllerPrefix.substring(1) : controllerPrefix;
                const basePath = cleanPrefix ? '/' + cleanPrefix : '';
                // If the method path is root ('/'), avoid trailing slash
                if (path === '/') {
                    path = basePath || '/';
                } else {
                    path = basePath + path;
                }
            }
            
            routes.push({ url: path, method });
        }
        
        return routes;
    }

    private removeDuplicateRoutes(routes: Array<{url: string, method: string}>): Array<{url: string, method: string}> {
        const seen = new Set<string>();
        const uniqueRoutes: Array<{url: string, method: string}> = [];
        
        for (const route of routes) {
            const key = `${route.method}:${route.url}`;
            if (!seen.has(key)) {
                seen.add(key);
                uniqueRoutes.push(route);
            }
        }
        
        return uniqueRoutes;
    }
}
