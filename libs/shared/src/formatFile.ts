import { resolveConfig, format } from 'prettier';

export const formatFile = (content: string): Promise<string> =>
    new Promise((res, rej) =>
        resolveConfig(process.cwd()).then((options) => {
            if (!options) {
                // no prettier configuration was found -> do nothing
                res(content);
            }

            try {
                const formatted = format(content, {
                    ...options,
                    parser: 'typescript',
                });

                res(formatted);
            } catch (error) {
                rej(error);
            }
        }),
    );

